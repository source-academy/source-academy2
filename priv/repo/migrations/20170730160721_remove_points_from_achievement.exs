defmodule SourceAcademy.Repo.Migrations.RemovePointsFromAchievement do
  use Ecto.Migration

  def change do
    alter table(:achievements) do
      remove :points
    end
  end
end
