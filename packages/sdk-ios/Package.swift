// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "SentinelSDK",
    platforms: [
        .iOS(.v16)
    ],
    products: [
        .library(name: "SentinelSDK", targets: ["SentinelSDK"])
    ],
    targets: [
        .target(name: "SentinelSDK")
    ]
)
