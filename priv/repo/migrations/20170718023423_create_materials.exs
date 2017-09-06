defmodule SourceAcademy.Repo.Migrations.CreateMaterials do
  use Ecto.Migration

  def change do
    create table(:materials_category) do
      add :name, :string
      add :is_shown, :boolean
      timestamps()
    end
    create table(:materials) do
      add :title, :string
      add :description, :text
      add :is_public, :boolean
      add :category_id, references(:materials_category, on_delete: :delete_all)
      add :uploader_id, references(:users)
      timestamps()
    end
  end
end
