defmodule SourceAcademy.Repo.Migrations.CreateMcqQuestions do
  @moduledoc false
  use Ecto.Migration

  def change do
    create table(:assessment_mcq_questions) do
      add :content, :text

      add :question_id, references(:assessment_questions,
        on_delete: :delete_all)

      timestamps()
    end

    create unique_index(
      :assessment_mcq_questions,
      [:question_id],
      name: :assessment_mcq_questions_question_id_index
    )
  end
end
