defmodule SourceAcademyWeb.AssessmentView do
  use SourceAcademyWeb, :view

  alias Timex.Timezone
  alias Timex.Duration
  alias SourceAcademy.Assessments.Attachment

  def display_cover_url(assessment) do
    Attachment.url(assessment.cover_url)
  end

  def display_due_date(date) do
    timezone = Timezone.get("Asia/Singapore", Timex.now)
    date = Timezone.convert(date, timezone)
      |> Timex.subtract(Duration.from_minutes(1))
    Timex.format!(date, "%d/%m %H:%M", :strftime)
  end

  def render("question.json", %{
    type: type,
    previous_action: previous_action,
    next_action: next_action,
    question: question,
    student: student,
    assessment: assessment
  } = params) do
    answer = params[:answer]
    save_action = params[:save_action]
    comments = params[:comments]

    base = %{
      config: %{
        filename: question.title,
        previousAction: previous_action,
        nextAction: next_action,
        saveAction: save_action,
        student_name: display_name(student.user),
        assessmentName: display_assessment_name(assessment),
        assessmentType: assessment.type,
        questionType: type
      }
    }
    if question.programming_question != nil do
      test_cases = question.programming_question.test_cases
        |> Enum.filter(&(!&1.is_private))
        |> Enum.map(&(%{
          code: &1.code,
          expectedResult: &1.expected_result
        }))
      library = assessment.library
      comments = Enum.map(comments, &(
        %{
          content: &1.content,
          createdAt: display_datetime(&1.inserted_at),
          posterName: display_name(&1.poster)
        }
      ))
      Map.merge(base, %{
        config: Map.merge(base.config, %{
          isReadOnly: answer.code.is_readonly,
          library: library
        }),
        editor: %{
          id: answer.code.id,
          value: answer.code.content,
          savedAt: answer.code.saved_at
        },
        programmingQuestion: %{
          id: question.programming_question.id,
          content: question.programming_question.content,
          marks: answer.marks,
          maxMarks: question.weight,
          tests: Enum.map(test_cases, &(%{
            code: &1.code,
            expected: &1.expectedResult
          }))
        },
        comments: comments
      })
    else
      choices = question.mcq_question.choices
        |> Enum.map(&(%{
          id: &1.id,
          selected: false,
          content: &1.content
        }))
      Map.merge(base, %{
        config: Map.merge(base.config, %{
          questionId: question.mcq_question.id,
        }),
        mcqQuestion: %{
          done: false,
          id: question.mcq_question.id,
          content: question.mcq_question.content,
          choices: choices
        }
      })
    end
  end

  def render("comment.json", %{comment: comment}) do
    %{
      id: comment.id,
      content: comment.content,
      poster: display_name(comment.poster)
    }
  end
end
