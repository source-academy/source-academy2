defmodule SourceAcademy.Repo.Migrations.RemoveAchievementDependency do
  use Ecto.Migration

  def change do
    drop_if_exists table(:achievement_dependencies)
  end
end
