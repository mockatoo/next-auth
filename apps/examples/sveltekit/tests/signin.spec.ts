import { expect, test } from "@playwright/test"

const MOCKATOO_ORIGIN = "https://app.mockatoo.globalunderdog.com"

test("GitHub sign-in goes to Mockatoo in development", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("button", { name: "Sign in", exact: true }).click()
  await page.getByRole("button", { name: "Sign in with GitHub" }).click()

  await expect(page).toHaveURL(new RegExp(`^${MOCKATOO_ORIGIN}/`))
  await expect(page.getByLabel("Email", { exact: true })).toBeVisible()
})

test("Sign in / Sign out with GitHub (Mockatoo)", async ({ page }) => {
  const email = process.env.MOCKATOO_TEST_EMAIL
  const password = process.env.MOCKATOO_TEST_PASSWORD
  if (!email || !password) {
    console.log(
      "::notice::MOCKATOO_TEST_EMAIL and MOCKATOO_TEST_PASSWORD are not set, so the full sign-in test is skipped."
    )
  }
  test.skip(
    !email || !password,
    "Set MOCKATOO_TEST_EMAIL and MOCKATOO_TEST_PASSWORD to run this test"
  )

  await test.step("should sign in", async () => {
    await page.goto("/")
    await page.getByRole("button", { name: "Sign in", exact: true }).click()
    await page.getByRole("button", { name: "Sign in with GitHub" }).click()

    await page.getByLabel("Email", { exact: true }).fill(email!)
    await page.getByLabel("Password", { exact: true }).fill(password!)
    await page.getByRole("button", { name: "Log in with password" }).click()
    await page.getByRole("button", { name: "Authorize" }).click()

    await expect(page.locator("header")).toContainText(email!)
  })

  await test.step("should sign out", async () => {
    await page.getByRole("button", { name: "Sign out" }).click()
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible()
  })
})
