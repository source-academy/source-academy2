defmodule SourceAcademy.Repo.Migrations.AddStudent do
  use Ecto.Migration

  def change do
    create table(:students) do
      add :experience_point, :integer
      add :level, :integer
      add :latest_story, :string

      add :user_id, references(:users, on_delete: :delete_all)

      timestamps()
    end
    create index(:students, [:user_id])
  end
end
