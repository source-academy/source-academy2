defmodule SourceAcademyAdmin.AnnouncementView do
  use SourceAcademyAdmin, :view

  def toggle_pin_link(conn, announcement) do
    label = if announcement.is_pinned, do: "Unpin", else: "Pin"
    link label,
      method: "put",
      to: admin_announcement_toggle_pin_path(conn, :toggle_pin, announcement.id),
      class: "pt-button pt-intent-warning"
  end

  def toggle_publish_link(conn, announcement) do
    label = if announcement.is_published, do: "Unpublish", else: "Publish"
    link label,
      method: "put",
      to: admin_announcement_toggle_publish_path(conn, :toggle_publish, announcement.id),
      class: "pt-button pt-intent-warning"
  end
end
