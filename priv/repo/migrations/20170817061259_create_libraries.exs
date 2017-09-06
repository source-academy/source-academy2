defmodule SourceAcademy.Repo.Migrations.CreateLibraries do
  use Ecto.Migration

  def change do
    create table(:libraries) do
      add :title, :string
      add :json, :map
    end
  end
end
