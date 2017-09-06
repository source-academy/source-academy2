defmodule SourceAcademy.Repo.Migrations.DeleteAuthorizationsOnUserDelete do
  use Ecto.Migration

  def change do
    execute "ALTER TABLE authorizations DROP CONSTRAINT authorizations_user_id_fkey"
    alter table(:authorizations) do
      modify :user_id, references(:users, on_delete: :delete_all)
    end
  end
end
