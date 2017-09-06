defmodule SourceAcademy.SeedHelper do
  @moduledoc false
  alias Ecto.Changeset
  alias SourceAcademy.Repo
  alias SourceAcademy.Accounts

  def add_user(params, opts \\ :empty) do
    password = opts[:password] || "password"
    role = opts[:role] || "student"

    registration_code = case role do
      "student" -> Application.get_env(:source_academy,
        :student_registration_code)
      "admin" -> Application.get_env(:source_academy,
        :admin_registration_code)
      "staff" -> Application.get_env(:source_academy,
        :staff_registration_code)
    end

    Repo.transaction fn ->
      {:ok, user} = Accounts.register_with_identity(%{
        "registration_code" => registration_code,
        "first_name" => params.first_name,
        "last_name" => params.last_name,
        "email" => params.email,
        "password" => password,
        "password_confirmation" => password
      })

      # Set correct role
      {:ok, user} = user
        |> Changeset.change(role: role)
        |> Repo.update

      # Set student to not phantom if student
      if role == "student" do
        user = Repo.preload(user, :student)

        user.student
        |> Changeset.change(is_phantom: false)
        |> Repo.update!
      end
    end
  end
end
