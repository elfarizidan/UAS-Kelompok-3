import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  projects,
  projectCategories,
  getProjectBySlug,
  getProjectsByCategory,
  getProjectsByMember,
  getMembersByProject,
  getAllTechnologies,
} from '../src/data/projects.js'
import { teamMembers } from '../src/data/team.js'

describe('Multi-Member Project Showcase Suite', () => {
  it('contains authentic projects matching Zulfa Yafiansyah portfolio', () => {
    assert.ok(projects.length >= 3, `Projects length is ${projects.length}, expected >= 3`)
    assert.strictEqual(projects.length, 8, 'Expected 8 curated projects')
  })

  it('contains both Personal and Team project ownership types', () => {
    const personalProjects = projects.filter((p) => p.type === 'Personal')
    const teamProjects = projects.filter((p) => p.type === 'Team')

    assert.ok(personalProjects.length > 0, 'Must have personal projects')
    assert.ok(teamProjects.length > 0, 'Must have team collaborative projects')
  })

  it('Zulfa Yafiansyah (member 1) has his authentic projects associated from LinkedIn & GitHub', () => {
    const zulfaWorks = getProjectsByMember(1)
    assert.ok(zulfaWorks.length >= 5, 'Zulfa should have projects from LinkedIn and GitHub')

    const hasSehatYuk = zulfaWorks.some((p) => p.slug === 'sehatyuk-health-platform')
    const hasJokiIn = zulfaWorks.some((p) => p.slug === 'joki-in-store-platform')
    const hasSima = zulfaWorks.some((p) => p.slug === 'sima-telu-internship-alumni')
    const hasSiCepat = zulfaWorks.some((p) => p.slug === 'sicepat-mobile-redesign')
    const hasUtsDataBuku = zulfaWorks.some((p) => p.slug === 'uts-data-buku-mobile')
    const hasErwe = zulfaWorks.some((p) => p.slug === 'erwe-community-platform')
    const hasVue = zulfaWorks.some((p) => p.slug === 'prak-vue-w2-lanjut')

    assert.ok(hasSehatYuk, 'Should contain SehatYuk')
    assert.ok(hasJokiIn, 'Should contain Joki-In & Joki-Store')
    assert.ok(hasSima, 'Should contain SIMA Tel-U')
    assert.ok(hasSiCepat, 'Should contain SiCepat Redesign')
    assert.ok(hasUtsDataBuku, 'Should contain UTS Data Buku')
    assert.ok(hasErwe, 'Should contain ERWE')
    assert.ok(hasVue, 'Should contain Prak Vue W2')
  })

  it('every team member has at least one associated project', () => {
    teamMembers.forEach((member) => {
      const memberWorks = getProjectsByMember(member.id)
      assert.ok(
        memberWorks.length >= 1,
        `Member ${member.name} (id: ${member.id}) should have at least 1 project, found ${memberWorks.length}`
      )
    })
  })

  it('every project has complete ownership and metadata', () => {
    projects.forEach((proj) => {
      assert.ok(proj.id, 'Project must have an id')
      assert.ok(proj.slug, 'Project must have a slug')
      assert.ok(proj.title, 'Project must have a title')
      assert.ok(proj.type, 'Project must specify ownership type (Personal / Team)')
      assert.ok(proj.shortDesc, 'Project must have a short description')
      assert.ok(proj.category, 'Project must have a category')
      assert.ok(Array.isArray(proj.tech) && proj.tech.length > 0, 'Project must have tech stack')
      assert.ok(proj.year, 'Project must have a year')
      assert.ok(Array.isArray(proj.contributors) && proj.contributors.length > 0, 'Project must have contributors')
      assert.ok(proj.problemStatement, 'Project must have a problem statement')
      assert.ok(proj.overview, 'Project must have an overview')
      assert.ok(proj.solution, 'Project must have a solution')

      proj.contributors.forEach((c) => {
        assert.ok(typeof c.memberId === 'number', 'Contributor must have a numeric memberId')
        assert.ok(typeof c.role === 'string' && c.role.trim().length > 0, 'Contributor must have a role string')
        const found = teamMembers.find((m) => m.id === c.memberId)
        assert.ok(found, `Contributor memberId ${c.memberId} must correspond to an existing team member`)
      })
    })
  })

  it('getProjectBySlug correctly returns project or null', () => {
    const project = getProjectBySlug('sehatyuk-health-platform')
    assert.ok(project)
    assert.strictEqual(project.title, 'SehatYuk — Web-Based Health Platform')

    const notFound = getProjectBySlug('unknown-slug')
    assert.strictEqual(notFound, null)
  })

  it('getMembersByProject resolves contributor details with member metadata', () => {
    const project = getProjectBySlug('sehatyuk-health-platform')
    const resolved = getMembersByProject(project)
    assert.strictEqual(resolved.length, project.contributors.length)
    resolved.forEach((item) => {
      assert.ok(item.member.name, 'Resolved member must have a name')
      assert.ok(item.role, 'Resolved item must have a role')
    })
  })

  it('getAllTechnologies extracts unique list of technologies', () => {
    const techs = getAllTechnologies()
    assert.ok(techs.length > 5, 'Should have multiple unique technologies')
    assert.ok(techs.includes('Laravel'))
    assert.ok(techs.includes('Vue.js'))
    assert.ok(techs.includes('Kotlin'))
    assert.ok(techs.includes('Figma'))
  })

  it('projectCategories includes All and distinct categories', () => {
    assert.ok(projectCategories.includes('All'))
    assert.ok(projectCategories.includes('Web App'))
    assert.ok(projectCategories.includes('Mobile App'))
    assert.ok(projectCategories.includes('Design'))
  })
})
