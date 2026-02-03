<template>
  <div class="page active">
    <div class="container">
      <div class="dash-layout">
        <!-- Sidebar -->
        <div class="sidebar">
          <a href="#" class="side-link active">Overview</a>
          <a href="#" class="side-link">My Sessions</a>
          <a href="#" class="side-link">Resources</a>
          <a href="#" class="side-link">Messages</a>
          <a href="#" class="side-link">Billing</a>
        </div>

        <!-- Main Content -->
        <div class="main-content">
          <h2>Hello, Sarah</h2>
          <p style="margin-bottom: 30px">
            Your next step in your wellness journey.
          </p>

          <!-- Upcoming Session -->
          <div
            class="card"
            style="border-left: 5px solid var(--accent); margin-bottom: 20px"
          >
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
            >
              <div>
                <h4
                  style="
                    color: var(--text-muted);
                    text-transform: uppercase;
                    font-size: 0.8rem;
                  "
                >
                  Upcoming Session
                </h4>
                <h3 style="margin: 5px 0">Tuesday, Oct 14th @ 10:00 AM</h3>
                <p>Video Consultation with Dr. Vance</p>
              </div>

              <button class="btn btn-primary">Join Call</button>
            </div>
          </div>

          <!-- Cards -->
          <div class="grid-3">
            <div class="card">
              <h4>Session Notes</h4>
              <p style="font-size: 0.9rem; margin-top: 10px">
                3 new documents shared by Dr. Vance.
              </p>
              <a
                href="#"
                style="color: var(--accent); display: block; margin-top: 10px"
              >
                View Folder
              </a>
            </div>

            <div class="card">
              <h4>Homework</h4>
              <p style="font-size: 0.9rem; margin-top: 10px">
                Reflection Journal: Resilience Exercise
              </p>
              <span class="status-badge"> Due in 2 days </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
