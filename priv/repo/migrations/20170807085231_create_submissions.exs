defmodule SourceAcademy.Repo.Migrations.CreateSubmissions do
  @moduledoc false
  use Ecto.Migration
  alias SourceAcademy.Assessments.SubmissionStatus

  def change do
    SubmissionStatus.create_type

    create table(:submissions) do
      add :status, :status
      add :override_xp, :integer

      add :student_id, references(:students, on_delete: :delete_all)
      add :grader_id, references(:users, on_delete: :nilify_all)
      add :assessment_id, references(:assessments, on_delete: :delete_all)

      timestamps()
    end
  end
end
