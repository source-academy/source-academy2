defmodule SourceAcademy.Repo.Migrations.CreateComments do
  use Ecto.Migration

  def change do
    create table(:comments) do
      add :content, :text
      add :is_resolved, :boolean

      add :poster_id, references(:users, on_delete: :nilify_all)
      add :code_id, references(:codes, on_delete: :delete_all)

      timestamps()
    end
  end
end
