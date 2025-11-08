package au.sentinel.mobile.network

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.net.VpnService
import android.os.Build
import android.os.ParcelFileDescriptor
import androidx.core.app.NotificationCompat
import au.sentinel.mobile.MainActivity
import java.nio.ByteBuffer
import java.nio.channels.DatagramChannel

class SentinelVpnService : VpnService() {
    private var vpnInterface: ParcelFileDescriptor? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        createNotificationChannel()
        startForeground(NOTIFICATION_ID, buildNotification("Tunnel starting"))
        vpnInterface = Builder()
            .setSession("Sentinel AU Tunnel")
            .addAddress("10.0.0.2", 32)
            .addDnsServer("1.1.1.1")
            .establish()
        Thread { pump() }.start()
        return START_STICKY
    }

    override fun onDestroy() {
        vpnInterface?.close()
        vpnInterface = null
        super.onDestroy()
    }

    private fun pump() {
        val descriptor = vpnInterface ?: return
        DatagramChannel.open().use { channel ->
            channel.connect(java.net.InetSocketAddress("127.0.0.1", 1080))
            val buffer = ByteBuffer.allocate(1024)
            while (vpnInterface != null) {
                buffer.clear()
                // TODO: integrate go-tun2socks bridge
                Thread.sleep(1_000)
            }
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            val channel = NotificationChannel(CHANNEL_ID, "Sentinel AU", NotificationManager.IMPORTANCE_LOW)
            manager.createNotificationChannel(channel)
        }
    }

    private fun buildNotification(status: String): Notification {
        val intent = PendingIntent.getActivity(
            this,
            0,
            Intent(this, MainActivity::class.java),
            PendingIntent.FLAG_IMMUTABLE
        )
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Sentinel AU")
            .setContentText(status)
            .setSmallIcon(android.R.drawable.stat_sys_vpn_ic)
            .setContentIntent(intent)
            .setOngoing(true)
            .build()
    }

    companion object {
        private const val CHANNEL_ID = "sentinel-au"
        private const val NOTIFICATION_ID = 1001

        fun createIntent(context: Context): Intent = Intent(context, SentinelVpnService::class.java)
    }
}
