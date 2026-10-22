import { describe, expect, it } from "vitest";
import { matchIntent } from "./intent-catalogue";

describe("intent catalogue evaluation dataset", () => {
  const directCases = [
    ["I want to manage app permissions", "Manage App Permissions", "App Permissions"],
    ["Turn on Wi-Fi", "Manage Wi-Fi", "Wi-Fi Settings"],
    ["I want to connect to Bluetooth", "Manage Bluetooth", "Bluetooth Settings"],
    ["Stop apps from sending notifications", "Manage Notifications", "Notification Settings"],
    ["Show me battery settings", "Manage Battery", "Battery Settings"],
    ["I want to change my screen brightness", "Manage Display", "Display Settings"],
    ["I want to change my phone wallpaper", "Manage Wallpaper", "Wallpaper Settings"],
    ["I want to manage my installed apps", "Manage Apps", "App Management"],
    ["I want to control mobile data", "Manage Mobile Data", "Mobile Data / Network Settings"],
    ["I want to change my phone language", "Manage Language", "Language Settings"],
    ["I want to manage location access", "Manage Location", "Location Settings"],
    ["Make my phone silent", "Manage Sound / Do Not Disturb", "Sound / Do Not Disturb Settings"],
    ["I want to change my password", "Manage Security", "Security Settings"],
  ] as const;

  for (const [request, intent, destination] of directCases) {
    it(request, () => {
      const result = matchIntent(request);
      expect(result.kind).toBe("match");
      if (result.kind === "match") {
        expect(result.entry.intent).toBe(intent);
        expect(result.entry.name).toBe(destination);
      }
    });
  }

  it("asks for clarification when the request is broad", () => {
    expect(matchIntent("Help me manage my phone").kind).toBe("clarify");
  });

  it("asks for clarification for a vague device problem", () => {
    expect(matchIntent("My phone isn't working properly").kind).toBe("clarify");
  });

  const unsupportedCases = [
    "Open Instagram",
    "Find a nearby restaurant",
    "Play a song",
  ];

  for (const request of unsupportedCases) {
    it(`does not invent a settings destination for: ${request}`, () => {
      expect(matchIntent(request).kind).toBe("none");
    });
  }

  it("returns only destinations from the approved catalogue", () => {
    const supportedRequests = [
      "Turn on Wi-Fi",
      "Connect my Bluetooth headphones",
      "Change screen brightness",
      "Change my password",
    ];

    for (const request of supportedRequests) {
      const result = matchIntent(request);
      if (result.kind === "match") {
        expect([
          "wifi",
          "bluetooth",
          "permissions",
          "notifications",
          "battery",
          "display",
          "wallpaper",
          "apps",
          "mobile-data",
          "language",
          "location",
          "sound",
          "security",
        ]).toContain(result.entry.id);
      }
    }
  });
});
