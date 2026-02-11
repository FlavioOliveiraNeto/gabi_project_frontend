<template>
  <div class="page active">
    <div class="container">
      <div class="dash-layout">
        <!-- Sidebar -->
        <div class="sidebar">
          <a href="#" class="side-link active">Practice Overview</a>
          <a href="#" class="side-link">Paciente List</a>
          <a href="#" class="side-link">Schedule</a>
          <a href="#" class="side-link">Clinical Notes</a>
          <a href="#" class="side-link">Settings</a>
        </div>

        <!-- Main Content -->
        <div class="main-content">
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 30px;
            "
          >
            <h2>Clinical Dashboard</h2>
            <button class="btn btn-primary">+ New Appointment</button>
          </div>

          <!-- Stats -->
          <div class="grid-3" style="margin-bottom: 30px">
            <div class="card" style="text-align: center">
              <h2 style="font-size: 2rem">8</h2>
              <p>Today's Sessions</p>
            </div>

            <div class="card" style="text-align: center">
              <h2 style="font-size: 2rem">124</h2>
              <p>Active Patients</p>
            </div>

            <div class="card" style="text-align: center">
              <h2 style="font-size: 2rem">4</h2>
              <p>Pending Notes</p>
            </div>
          </div>

          <!-- Schedule Table -->
          <div class="card">
            <h3>Today's Schedule</h3>

            <table
              style="width: 100%; border-collapse: collapse; margin-top: 20px"
            >
              <tr style="border-bottom: 1px solid #eee; text-align: left">
                <th style="padding: 10px">Time</th>
                <th>Paciente</th>
                <th>Type</th>
                <th>Status</th>
              </tr>

              <tr style="border-bottom: 1px solid #eee">
                <td style="padding: 15px 10px">09:00 AM</td>
                <td>James Wilson</td>
                <td>In-Person</td>
                <td>
                  <span
                    class="status-badge"
                    style="background: #e3f2fd; color: #1976d2"
                  >
                    Checked In
                  </span>
                </td>
              </tr>

              <tr style="border-bottom: 1px solid #eee">
                <td style="padding: 15px 10px">10:00 AM</td>
                <td>Sarah Jenkins</td>
                <td>Video</td>
                <td>
                  <span class="status-badge"> Confirmed </span>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
