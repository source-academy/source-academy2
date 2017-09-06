defmodule SourceAcademy.Repo.Migrations.AddSubmittedAtToSubmission do
  @moduledoc false
  use Ecto.Migration

  def change do
    alter table(:submissions) do
      add :submitted_at, :timestamp
    end
  end
end
