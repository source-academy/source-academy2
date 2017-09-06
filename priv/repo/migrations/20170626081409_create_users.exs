defmodule SourceAcademy.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :first_name, :string
      add :last_name, :string
      add :email, :string
      add :role, :string, default: "student"
      add :passwd_reset_id, :string
      add :passwd_reset_id_expiry, :utc_datetime

      timestamps()
    end

    create index(:users, [:email], unique: true)
    create index(:users, [:id], where: "role = 'student'")
  end
end
