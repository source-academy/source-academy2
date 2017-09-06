defmodule SourceAcademyWeb.InboxView do
  use SourceAcademyWeb, :view

  def assessments_of_type(assessment_submissions, type) do
    assessment_submissions
    |> Enum.filter(fn {a, _} -> a.type == type end)
  end
end
