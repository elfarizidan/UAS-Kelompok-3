import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert'
import { useTeam } from '../src/composables/useTeam.js'
import { useProjects } from '../src/composables/useProjects.js'
import { teamMembers as initialMembers } from '../src/data/team.js'

describe('Dynamic Team Member Management & Persistence Suite', () => {
  let team
  let projectService

  beforeEach(() => {
    team = useTeam()
    projectService = useProjects()
    team.resetToDefault()
  })

  it('initializes with default team members', () => {
    assert.strictEqual(team.teamMembers.value.length, initialMembers.length)
    const zulfa = team.getMemberById(1)
    assert.ok(zulfa)
    assert.strictEqual(zulfa.name, 'Zulfa Yafiansyah')
    assert.strictEqual(zulfa.nim, '102042330003')
  })

  it('allows adding a new team member dynamically without code changes', () => {
    const initialCount = team.teamMembers.value.length
    const created = team.addMember({
      name: 'Anggota Baru Enam',
      nim: '102042330099',
      role: 'Cloud Architect',
      skills: 'AWS, Kubernetes, Terraform',
      bio: 'Fokus pada arsitektur cloud dan automasi infrastruktur.',
      github: 'https://github.com/anggota6',
      email: 'anggota6@telkomuniversity.ac.id',
    })

    assert.ok(created)
    assert.strictEqual(team.teamMembers.value.length, initialCount + 1)
    assert.strictEqual(created.name, 'Anggota Baru Enam')
    assert.strictEqual(created.nim, '102042330099')
    assert.strictEqual(created.role, 'Cloud Architect')
    assert.deepStrictEqual(created.skills, ['AWS', 'Kubernetes', 'Terraform'])

    const fetched = team.getMemberById(created.id)
    assert.strictEqual(fetched.name, 'Anggota Baru Enam')
  })

  it('allows editing an existing team member', () => {
    const updated = team.updateMember(2, {
      name: 'Anggota Dua (Updated)',
      role: 'Lead Backend Engineer',
      skills: ['Go', 'Docker', 'PostgreSQL'],
    })

    assert.ok(updated)
    assert.strictEqual(updated.name, 'Anggota Dua (Updated)')
    assert.strictEqual(updated.role, 'Lead Backend Engineer')
    assert.deepStrictEqual(updated.skills, ['Go', 'Docker', 'PostgreSQL'])

    const fetched = team.getMemberById(2)
    assert.strictEqual(fetched.name, 'Anggota Dua (Updated)')
  })

  it('allows deleting a team member cleanly', () => {
    const initialCount = team.teamMembers.value.length
    const success = team.deleteMember(5) // Delete member 5
    assert.strictEqual(success, true)
    assert.strictEqual(team.teamMembers.value.length, initialCount - 1)
    assert.strictEqual(team.getMemberById(5), null)
  })

  it('resets back to initial members when resetToDefault is called', () => {
    team.addMember({ name: 'Temp Member', role: 'Tester' })
    assert.strictEqual(team.teamMembers.value.length, initialMembers.length + 1)

    team.resetToDefault()
    assert.strictEqual(team.teamMembers.value.length, initialMembers.length)
  })

  it('allows uploading and persisting avatar as base64 data url', () => {
    const base64Avatar = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP...'
    const created = team.addMember({
      name: 'Anggota Foto Device',
      role: 'UI Designer',
      avatar: base64Avatar,
    })

    assert.strictEqual(created.avatar, base64Avatar)
    const fetched = team.getMemberById(created.id)
    assert.strictEqual(fetched.avatar, base64Avatar)
  })

  it('syncs GitHub repositories and accurately populates Total Proyek, Personal, and Team Project', () => {
    const member = team.addMember({
      name: 'Danu Putra',
      role: 'Fullstack Engineer',
      github: 'https://github.com/elfarizidan',
    })

    const sampleRepos = [
      {
        id: 991,
        name: 'personal-blog',
        fork: false,
        language: 'Vue',
        description: 'Personal portfolio and tech blog',
        html_url: 'https://github.com/elfarizidan/personal-blog',
      },
      {
        id: 992,
        name: 'ecommerce-platform',
        fork: false,
        language: 'PHP',
        description: 'Laravel e-commerce system',
        html_url: 'https://github.com/elfarizidan/ecommerce-platform',
      },
      {
        id: 993,
        name: 'team-collaboration-tool',
        fork: true,
        language: 'TypeScript',
        description: 'Forked team collaboration tool',
        html_url: 'https://github.com/elfarizidan/team-collaboration-tool',
      },
    ]

    const synced = projectService.syncMemberGithubProjects(member.id, sampleRepos)
    assert.strictEqual(synced.length, 3)

    const memberProjects = projectService.getProjectsByMember(member.id)
    assert.strictEqual(memberProjects.length, 3) // Total Proyek

    const personal = memberProjects.filter((p) => p.type === 'Personal')
    assert.strictEqual(personal.length, 2) // Personal Project

    const teamProj = memberProjects.filter((p) => p.type === 'Team')
    assert.strictEqual(teamProj.length, 1) // Team Project
  })
})
