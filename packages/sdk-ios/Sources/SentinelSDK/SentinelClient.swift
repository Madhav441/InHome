import Foundation

public struct SentinelClient {
    private let baseURL: URL
    private let session: URLSession

    public init(baseURL: URL = URL(string: "https://api.sentinel.au")!, session: URLSession = .shared) {
        self.baseURL = baseURL
        self.session = session
    }

    public func fetchPolicy(deviceId: String) async throws -> Data {
        let url = baseURL.appendingPathComponent("v1/policy/\(deviceId)")
        let (data, _) = try await session.data(from: url)
        return data
    }
}
