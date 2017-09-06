defmodule SourceAcademy.Repo.Migrations.AddAchievementDependencies do
  use Ecto.Migration

  def change do
    create table(:achievement_dependencies) do
      add :achievement_id, references(:achievements, on_delete: :delete_all)
      add :dependency_id, references(:achievements, on_delete: :delete_all)

      timestamps()
    end

    create index(:achievement_dependencies,
      [:achievement_id, :dependency_id], unique: true)
  end
end
