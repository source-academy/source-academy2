defmodule SourceAcademy.Repo.Migrations.AddBioToUser do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :bio, :string
    end
  end
end
