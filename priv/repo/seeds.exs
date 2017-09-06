# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     SourceAcademy.Repo.insert!(%SourceAcademy.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.
import SourceAcademy.SeedHelper

require Logger
admin_password = Application.get_env(:source_academy, :admin_password)

admin = %{
  first_name: "Administrator",
  last_name: "",
  email: "admin@sourceacademy.comp.nus.edu.sg"
}

add_user(admin, role: "admin", password: admin_password)
