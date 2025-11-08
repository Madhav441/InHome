import { Link } from 'expo-router';
import { View, Text, Pressable, FlatList } from 'react-native';

const alerts = [
  { id: '1', profile: 'Maya', summary: 'Self-harm keyword detected', severity: 'High', ts: '08:32 AEST' },
  { id: '2', profile: 'Kai', summary: 'Attempted gambling site access', severity: 'Medium', ts: '21:10 AEST' }
];

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, padding: 24, gap: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: '600', color: '#12312a' }}>Sentinel AU</Text>
      <Text style={{ fontSize: 14, color: '#226956' }}>
        Receive high-priority alerts and apply quick overrides. Consent logs and privacy summaries are available via the web
        dashboard.
      </Text>
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <View style={{ borderRadius: 12, borderColor: '#b0ddcf', borderWidth: 1, padding: 16, backgroundColor: 'white' }}>
            <Text style={{ color: '#2d846f', fontWeight: '600' }}>
              {item.severity} • {item.profile}
            </Text>
            <Text style={{ color: '#184539', marginTop: 4 }}>{item.summary}</Text>
            <Text style={{ color: '#5f8579', marginTop: 4, fontSize: 12 }}>{item.ts}</Text>
            <Pressable style={{ marginTop: 12 }}>
              <Link href="/override" style={{ color: '#226956', fontWeight: '600' }}>
                Issue 15-minute override
              </Link>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}
