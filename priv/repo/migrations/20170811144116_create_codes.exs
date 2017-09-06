defmodule SourceAcademy.Repo.Migrations.CreateCodes do
  use Ecto.Migration

  def change do
    create table(:codes) do
      add :title, :string
      add :content, :text
      add :is_public, :boolean
      add :is_readonly, :boolean

      add :owner_id, references(:users, on_delete: :nilify_all)

      timestamps()
    end

    create index(:codes, [:owner_id])
  end
end
