import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert'
import { useProjects } from '../src/composables/useProjects.js'
import { teamMembers } from '../src/data/team.js'

describe('Dynamic Project Management & Persistence Suite', () => {
  const {
    projects,
    addProject,
    updateProject,
    deleteProject,
    getProjectBySlug,
    getProjectsByMember,
    resetToDefault,
  } = useProjects()

  beforeEach(() => {
    resetToDefault()
  })

  it('allows any member to add a custom project without code changes', () => {
    const initialCount = projects.value.length

    const newProject = addProject({
      title: 'Portal Akademik Mahasiswa Mandiri',
      category: 'Web App',
      type: 'Personal',
      year: '2025',
      status: 'Completed',
      shortDesc: 'Aplikasi portal akademik mandiri dengan dashboard terintegrasi.',
      problemStatement: 'Kesulitan mahasiswa memantau progress studi semester.',
      solution: 'Dashboard interaktif berbasis Vue 3 dan Tailwind CSS.',
      tech: ['Vue.js', 'Tailwind CSS', 'Vite'],
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      contributors: [
        { memberId: 1, role: 'Sole Architect & Developer' },
      ],
      repoUrl: 'https://github.com/PanjulAja/portal-akademik',
      demoUrl: 'https://portal-akademik.vercel.app',
    })

    assert.ok(newProject, 'New project should be returned')
    assert.strictEqual(projects.value.length, initialCount + 1, 'Project count should increase by 1')
    assert.strictEqual(newProject.title, 'Portal Akademik Mahasiswa Mandiri')
    assert.strictEqual(newProject.isCustom, true, 'Should be marked as custom')
    assert.ok(newProject.slug.includes('portal-akademik'), 'Slug should be generated from title')

    // Find by slug
    const retrieved = getProjectBySlug(newProject.slug)
    assert.ok(retrieved, 'Should retrieve project by generated slug')
    assert.strictEqual(retrieved.id, newProject.id)

    // Member 1 should have this project in their portfolio
    const member1Projects = getProjectsByMember(1)
    const existsInMember = member1Projects.some((p) => p.slug === newProject.slug)
    assert.ok(existsInMember, 'Project should be associated with member 1')
  })

  it('allows non-lead members (e.g. member 2) to add their own project', () => {
    const member2 = teamMembers.find((m) => m.id === 2)
    assert.ok(member2, 'Member 2 should exist in team')

    const newProject = addProject({
      title: 'Mobile Fitness Tracker Flutter',
      category: 'Mobile App',
      type: 'Personal',
      year: '2025',
      shortDesc: 'Aplikasi pelacak kebugaran dan kalori harian untuk smartphone.',
      contributors: [
        { memberId: 2, role: 'Mobile UI Engineer' },
      ],
    })

    const member2Projects = getProjectsByMember(2)
    const found = member2Projects.some((p) => p.id === newProject.id)
    assert.ok(found, `Project should be listed in member ${member2.name}'s portfolio`)
  })

  it('supports multi-member collaborative projects with distinct roles', () => {
    const multiProject = addProject({
      title: 'Kampus E-Voting System',
      category: 'Web App',
      type: 'Team',
      year: '2025',
      shortDesc: 'Sistem pemilihan suara elektronik kampus dengan enkripsi aman.',
      contributors: [
        { memberId: 1, role: 'Fullstack & Security Engineer' },
        { memberId: 3, role: 'Frontend & UX Designer' },
      ],
    })

    const member1Works = getProjectsByMember(1)
    const member3Works = getProjectsByMember(3)

    assert.ok(member1Works.some((p) => p.id === multiProject.id), 'Member 1 should have project')
    assert.ok(member3Works.some((p) => p.id === multiProject.id), 'Member 3 should have project')
  })

  it('allows custom projects to be deleted cleanly', () => {
    const added = addProject({
      title: 'Temporary Test Project',
      shortDesc: 'This project will be removed to verify delete functionality.',
      contributors: [{ memberId: 1, role: 'Tester' }],
    })

    const countAfterAdd = projects.value.length
    assert.ok(getProjectBySlug(added.slug), 'Project should exist before deletion')

    const deleted = deleteProject(added.id)
    assert.strictEqual(deleted, true, 'deleteProject should return true')
    assert.strictEqual(projects.value.length, countAfterAdd - 1, 'Count should decrease by 1')
    assert.strictEqual(getProjectBySlug(added.slug), null, 'Project should not exist after deletion')
  })

  it('resets back to initial projects when resetToDefault is called', () => {
    addProject({
      title: 'Ephemeral Project 1',
      shortDesc: 'Test short description placeholder.',
      contributors: [{ memberId: 1, role: 'Developer' }],
    })
    addProject({
      title: 'Ephemeral Project 2',
      shortDesc: 'Test short description placeholder 2.',
      contributors: [{ memberId: 2, role: 'Developer' }],
    })

    assert.strictEqual(projects.value.length, 10) // 8 initial + 2 added

    resetToDefault()
    assert.strictEqual(projects.value.length, 8)
  })

  it('supports comprehensive case study fields (Overview, Background, Objectives, Key Features, Development Process, Results)', () => {
    const detailed = addProject({
      title: 'Audit System Log Analyzer',
      category: 'Backend / API',
      type: 'Personal',
      year: '2025',
      shortDesc: 'Sistem analisis log audit keamanan dan anomali server.',
      overview: 'Platform audit log komprehensif untuk mendeteksi ancaman keamanan secara proaktif.',
      background: 'Banyak sistem internal mengalami kesulitan mendeteksi kebocoran data tepat waktu.',
      problemStatement: 'Volume log server yang terlampau besar dan sulit diurai manual.',
      solution: 'Pipeline analitik terotomasi dengan parsing berbasis regex dan agregasi metrik.',
      objectives: [
        'Mempercepat deteksi insiden keamanan di bawah 5 menit',
        'Menyediakan alert notifikasi real-time via Telegram Webhook',
      ],
      keyFeatures: [
        'Parser log multi-format (Nginx, Apache, Syslog)',
        'Dashboard metrik latensi dan failure rate',
      ],
      developmentProcess: [
        { phase: '01. Analisis Kebutuhan', desc: 'Riset pola log server dan spesifikasi metrik.' },
        { phase: '02. Implementasi Engine', desc: 'Pembuatan pipeline ingestion data.' },
      ],
      results: 'Mengurangi waktu investigasi insiden dari 2 jam menjadi 12 menit.',
      contributors: [{ memberId: 1, role: 'Lead DevOps Engineer' }],
    })

    assert.strictEqual(detailed.overview, 'Platform audit log komprehensif untuk mendeteksi ancaman keamanan secara proaktif.')
    assert.strictEqual(detailed.background, 'Banyak sistem internal mengalami kesulitan mendeteksi kebocoran data tepat waktu.')
    assert.strictEqual(detailed.problemStatement, 'Volume log server yang terlampau besar dan sulit diurai manual.')
    assert.strictEqual(detailed.solution, 'Pipeline analitik terotomasi dengan parsing berbasis regex dan agregasi metrik.')
    assert.strictEqual(detailed.results, 'Mengurangi waktu investigasi insiden dari 2 jam menjadi 12 menit.')
    assert.strictEqual(detailed.objectives.length, 2)
    assert.strictEqual(detailed.keyFeatures.length, 2)
    assert.strictEqual(detailed.developmentProcess.length, 2)
    assert.strictEqual(detailed.developmentProcess[0].phase, '01. Analisis Kebutuhan')

    // Test updateProject
    const updated = updateProject(detailed.id, {
      title: 'Audit System Log Analyzer v2',
      results: 'Mencapai reduksi waktu insiden hingga 95% secara stabil.',
      objectives: ['Tujuan Baru 1', 'Tujuan Baru 2', 'Tujuan Baru 3'],
      keyFeatures: ['Fitur Baru 1'],
    })

    assert.strictEqual(updated.title, 'Audit System Log Analyzer v2')
    assert.strictEqual(updated.results, 'Mencapai reduksi waktu insiden hingga 95% secara stabil.')
    assert.strictEqual(updated.objectives.length, 3)
    assert.strictEqual(updated.keyFeatures.length, 1)
  })
})
