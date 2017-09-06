defmodule SourceAcademy.Repo.Migrations.AddUrlToMaterials do
  use Ecto.Migration

  def change do
    alter table(:materials) do
      add :url, :string
    end
  end
end
