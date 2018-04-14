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
    code_history = params[:code_history]

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
      
      code_history = code_history
      |> Enum.filter(&(&1.title == "history"))
      |> Enum.sort(&(&1.inserted_at <= &2.inserted_at))
      |> Enum.sort(&(&1.generated_at <= &2.generated_at))
      |> Enum.map(&(
        %{
          content: &1.content,
          createdAt: display_datetime(&1.inserted_at),
          title: &1.title,
          id: &1.id,
          generatedAt: &1.generated_at
        }
      ))
      Map.merge(base, %{
        config: Map.merge(base.config, %{
          isReadOnly: answer.code.is_readonly,
          library: library
        }),
        editor: %{
          id: answer.code.id,
          value: answer.code.content
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
        comments: comments,
        code_history: code_history
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
