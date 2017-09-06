defmodule SourceAcademy.Repo.Migrations.AddAchievement do
  use Ecto.Migration

  def change do
    create table(:achievements) do
      add :title, :string
      add :description, :text
      add :points, :integer
      add :display_order, :integer
      add :image_src, :string
      add :category, :string
      add :query, :text

      timestamps()
    end
  end
end
