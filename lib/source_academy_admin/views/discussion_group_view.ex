defmodule SourceAcademyAdmin.DiscussionGroupView do
  use SourceAcademyAdmin, :view

  def view_student_link(conn, discussion_group) do
    student_id = discussion_group.student.id
    link "View",
      to: admin_student_path(conn, :show, student_id),
      class: "pt-button pt-intent-primary"
  end

  def remove_student_link(conn, discussion_group) do
    link "Remove",
      to: admin_discussion_group_path(conn, :delete, discussion_group.id),
      method: :delete,
      class: "pt-button pt-intent-danger"
  end
end
