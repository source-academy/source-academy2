defmodule SourceAcademy.Repo.Migrations.ChangePathSubmissionCode do
  use Ecto.Migration

  def up do
    alter table(:path_submissions) do
      modify :code, :text
    end
  end

  def down do
    alter table(:path_submissions) do
      modify :code, :string
    end
  end
end
