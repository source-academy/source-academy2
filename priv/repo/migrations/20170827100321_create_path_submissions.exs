defmodule SourceAcademy.Repo.Migrations.CreatePathSubmissions do
  @moduledoc false
  use Ecto.Migration

  def change do
    create table(:path_submissions) do
      add :code, :string
      add :is_correct, :boolean
      add :question_id,
        references(:assessment_questions, on_delete: :nilify_all)
      add :mcq_choice_id,
        references(:assessment_mcq_choices, on_delete: :nilify_all)
      add :student_id, references(:students, on_delete: :delete_all)
      timestamps()
    end
  end
end
