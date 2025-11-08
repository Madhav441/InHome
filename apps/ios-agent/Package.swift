// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "SentinelAUiOS",
    platforms: [
        .iOS(.v17)
    ],
    products: [
        .app(name: "SentinelAUiOSApp", targets: ["App"])
    ],
    dependencies: [],
    targets: [
        .executableTarget(
            name: "App",
            path: "Sources/App"
        )
    ]
)
