defmodule SourceAcademyAdmin.StudentView do
  use SourceAcademyAdmin, :view

  def show_students(students, [is_phantom: is_phantom]), do:
    show_students(students, [is_phantom: is_phantom, sort_by: :name])
  def show_students(students, [sort_by: sort_by]), do:
    show_students(students, [is_phantom: false, sort_by: sort_by])
  def show_students(students, [is_phantom: is_phantom, sort_by: sort_by]) do
    students = Enum.filter(students, &(&1.is_phantom == is_phantom))
    case sort_by do
      :name -> Enum.sort_by(students, &(display_name(&1)))
      _ -> students
    end
  end
end
