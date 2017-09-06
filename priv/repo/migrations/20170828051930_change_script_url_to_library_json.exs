defmodule SourceAcademy.Repo.Migrations.ChangeScriptUrlToLibraryJson do
  use Ecto.Migration

  def up do
    alter table(:assessments) do
      add :library, :json
      remove :script_url
    end
  end

  def down do
    alter table(:assessments) do
      remove :library
      add :script_url, :string
    end
  end
end
