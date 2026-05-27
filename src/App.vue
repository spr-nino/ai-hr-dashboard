<script setup>
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import UploadCard from './components/UploadCard.vue'
import AnalysisCard from './components/AnalysisCard.vue'
import JobInfoCard from './components/JobInfoCard.vue'
import StatsCards from './components/StatsCards.vue'
import MatchChart from './components/MatchChart.vue'
import ScreeningChart from './components/ScreeningChart.vue'
import CandidatesTable from './components/CandidatesTable.vue'

const sidebarOpen = ref(true)

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <div class="min-h-screen bg-[#f5f7fa]">
    <!-- Sidebar -->
    <Sidebar v-if="sidebarOpen" />

    <!-- Main area -->
    <div :class="['transition-all duration-300', sidebarOpen ? 'ml-[240px]' : 'ml-0']">
      <!-- Header -->
      <Header @toggle-sidebar="toggleSidebar" />

      <!-- Content -->
      <main class="p-5 space-y-5">
        <!-- Row 1: Upload + Analysis + Job Info -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div class="lg:col-span-3">
            <UploadCard />
          </div>
          <div class="lg:col-span-5">
            <AnalysisCard />
          </div>
          <div class="lg:col-span-4">
            <JobInfoCard />
          </div>
        </div>

        <!-- Row 2: Stats -->
        <StatsCards />

        <!-- Row 3: Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <MatchChart />
          <ScreeningChart />
        </div>

        <!-- Row 4: Table -->
        <CandidatesTable />
      </main>
    </div>
  </div>
</template>

<style>
.card {
  background: #fff;
  border: 1px solid #f1f5f9;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.04);
}
</style>
