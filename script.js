const OPENCAGE_API_KEY = "9680e5551b2041fd9b8171085963d7f2"; // your real API key

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("location-form");
  const locationInputsDiv = document.getElementById("location-inputs");
  const addLocationBtn = document.getElementById("add-location");
  const resultsDiv = document.getElementById("results");

  addLocationBtn.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "text";
    input.name = "location";
    input.placeholder = "Enter city or country";
    input.required = true;
    locationInputsDiv.appendChild(input);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    resultsDiv.innerHTML = "🔄 Loading...";

    const inputs = locationInputsDiv.querySelectorAll("input[name='location']");
    const cities = [];

    inputs.forEach((input) => {
      const value = input.value.trim();
      if (value) {
        cities.push(value);
      }
    });

    if (cities.length < 2) {
      resultsDiv.innerHTML = `<p style="color:red;">❌ Please enter at least two cities or countries.</p>`;
      return;
    }

    try {
      const timeRanges = [];

      for (const city of cities) {
        const tz = await getTimezoneForCity(city);
        const { startUtc, endUtc } = getUtcTimeRangeForTimezone(tz);

        timeRanges.push({
          city,
          timezone: tz,
          startUtc,
          endUtc,
        });
      }

      resultsDiv.innerHTML = `
        <h2>🕐 Availability Windows in UTC:</h2>
        <ul>
          ${timeRanges
            .map(
              (r) =>
                `<li><strong>${r.city}</strong> (${r.timezone}): ${r.startUtc.toFormat("HH:mm")} – ${r.endUtc.toFormat("HH:mm")} UTC</li>`
            )
            .join("")}
        </ul>
      `;

      const overlappingSlots = findOverlappingWindow(timeRanges);

      if (!overlappingSlots || overlappingSlots.length === 0) {
        resultsDiv.innerHTML += `<p style="color:red;">❌ No common time slot available.</p>`;
        return;
      }

      resultsDiv.innerHTML += `
        <h2>✅ Common 1-hour Time Slots:</h2>
        <ul>
          ${overlappingSlots
            .map(
              (slot, i) => `
            <li>
              <strong>Slot ${i + 1}:</strong> ${slot.start.toFormat("HH:mm")} – ${slot.end.toFormat("HH:mm")} UTC
              <ul>
                ${timeRanges
                  .map((r) => {
                    const localStart = slot.start.setZone(r.timezone);
                    const localEnd = slot.end.setZone(r.timezone);
                    return `<li>${r.city}: ${localStart.toFormat("hh:mm a")} – ${localEnd.toFormat("hh:mm a")} (${r.timezone})</li>`;
                  })
                  .join("")}
              </ul>
            </li>`
            )
            .join("")}
        </ul>
      `;
    } catch (err) {
      console.error(err);
      resultsDiv.innerHTML = `<p style="color:red;">❌ Error: ${err.message}</p>`;
    }
  });
});

// 🔎 Get IANA timezone for a given city using OpenCage API
async function getTimezoneForCity(city) {
  const response = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${OPENCAGE_API_KEY}`
  );
  const data = await response.json();
  if (data.results.length === 0) throw new Error("City not found");

  const { annotations } = data.results[0];
  const timeZone = annotations.timezone.name;
  return timeZone;
}

// 🕘 Get 9 AM – 8 PM local availability converted to UTC
function getUtcTimeRangeForTimezone(timezone) {
  const { DateTime } = luxon;

  const now = DateTime.now().setZone(timezone);
  const date = now.startOf("day");

  const startLocal = date.set({ hour: 9 });
  const endLocal = date.set({ hour: 20 });

  return {
    startUtc: startLocal.toUTC(),
    endUtc: endLocal.toUTC(),
  };
}

// 🔁 Find common overlapping window among all UTC ranges
function findOverlappingWindow(ranges) {
  let latestStart = ranges[0].startUtc;
  let earliestEnd = ranges[0].endUtc;

  for (let i = 1; i < ranges.length; i++) {
    if (ranges[i].startUtc > latestStart) latestStart = ranges[i].startUtc;
    if (ranges[i].endUtc < earliestEnd) earliestEnd = ranges[i].endUtc;
  }

  if (latestStart >= earliestEnd) return null;

  const slots = [];
  let current = latestStart;
  while (current.plus({ hours: 1 }) <= earliestEnd) {
    slots.push({
      start: current,
      end: current.plus({ hours: 1 }),
    });
    current = current.plus({ hours: 1 });
  }

  return slots;
}
