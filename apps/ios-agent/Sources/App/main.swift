import SwiftUI
import FamilyControls
import DeviceActivity
import ManagedSettings

@main
struct SentinelAUiOSApp: App {
    @State private var authorization = AuthorizationCenter.shared
    @State private var statusMessage = "Awaiting authorisation"

    var body: some Scene {
        WindowGroup {
            ContentView(statusMessage: $statusMessage)
                .task {
                    await requestFamilyControls()
                }
        }
    }

    private func requestFamilyControls() async {
        do {
            try await authorization.requestAuthorization(for: .individual)
            statusMessage = "Authorised"
        } catch {
            statusMessage = "Authorisation failed: \(error.localizedDescription)"
        }
    }
}

struct ContentView: View {
    @Binding var statusMessage: String
    @State private var shieldStore = ManagedSettingsStore()

    var body: some View {
        NavigationStack {
            VStack(spacing: 24) {
                Text("Sentinel AU iOS agent")
                    .font(.title2)
                    .bold()
                Text(statusMessage)
                    .font(.subheadline)
                Button("Apply school hours schedule") {
                    let schedule = DeviceActivitySchedule(
                        intervalStart: DateComponents(hour: 9, minute: 0),
                        intervalEnd: DateComponents(hour: 15, minute: 0),
                        repeats: true
                    )
                    let event = DeviceActivityEvent(token: DeviceActivityEvent.Token(rawValue: "school"))
                    try? DeviceActivityCenter().startMonitoring(.daily, during: schedule, events: [event])
                    shieldStore.shield.applicationCategories = ShieldSettings.ActivityCategoryPolicy.limited(.socialNetworking)
                    statusMessage = "School hours schedule applied"
                }
                .buttonStyle(.borderedProminent)
            }
            .padding()
            .navigationTitle("Guardian pairing")
        }
    }
}
