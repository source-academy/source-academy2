defmodule SourceAcademy.ViewHelpers do
  @moduledoc false
  alias SourceAcademy.Accounts.User
  alias SourceAcademy.Course.Student
  alias SourceAcademy.Course.Attachment
  alias Timex.Timezone

  def display_name(nil), do: "Anonymous"
  def display_name(%Student{} = student), do: display_name(student.user)
  def display_name(%User{} = user) do
    if user.last_name == nil do
      user.first_name
    else
      user.first_name <> " " <> user.last_name
    end
  end

  def display_datetime(date) do
    timezone = Timezone.get("Asia/Singapore", Timex.now)
    date = Timezone.convert(date, timezone)
    Timex.format!(date, "%d/%m %H:%M", :strftime)
  end

  def display_material_url(material) do
    if material.url != nil do
      Attachment.url({material.url, material}, signed: true)
    else
      "#"
    end
  end

  def display_assessment_name(assessment) do
    prefix = case assessment.type do
      :mission -> "Mission"
      :sidequest -> "Sidequest"
      :contest -> "Contest"
      :path -> "Path"
    end
    prefix <> " " <> assessment.name
  end
end
