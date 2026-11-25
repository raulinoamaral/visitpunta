import type { Field } from 'payload'

/** Sidebar box listing where the document is featured (Admin → Ubicaciones) */
export const appearsInField: Field = {
  name: 'appearsIn',
  type: 'ui',
  admin: {
    position: 'sidebar',
    components: { Field: '/components/admin/AppearsIn#AppearsIn' },
  },
}
