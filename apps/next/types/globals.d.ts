export { };

export type Roles = "superadmin" | "q-admin" | "t-admin" | "manager" | "designer" | "teacher" | "gc" | "parent" | "sales";

declare global {
  interface CustomJwtSessionClaims {
    firstName?: string
    lastName?: string
    email?: string
    imageUrl?: string
    metadata: {
      role?: Array<Roles>
      onboarded: boolean
      userRole: "existing_user" | "new_user"
      tempRole?: "invited_student"
      school?: { url: string, id: number }
    }
  }
}