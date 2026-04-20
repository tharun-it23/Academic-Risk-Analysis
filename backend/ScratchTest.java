import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class ScratchTest {
    public static void main(String[] args) throws Exception {
        Class.forName("org.sqlite.JDBC");
        String uri = "jdbc:sqlite:D:\\Academic Risk Analysis System\\backend\\data\\academic_risk.db";
        try (Connection conn = DriverManager.getConnection(uri);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT * FROM users")) {
            while (rs.next()) {
                System.out.println("ID: " + rs.getInt("id") + " User: " + rs.getString("username") + " Pass: " + rs.getString("password") + " Role: " + rs.getString("role"));
            }
        }
    }
}
