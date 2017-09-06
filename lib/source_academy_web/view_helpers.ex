defmodule SourceAcademyWeb.ViewHelpers do
  @moduledoc false
  alias SourceAcademyWeb.HelperView

  def navbar_tab(conn, label, id, opts \\ []) do
    generic_tab(conn.assigns[:navbar_tab], label, id, opts)
  end

  def primary_tab(conn, label, id, opts \\ []) do
    generic_tab(conn.assigns[:primary_tab], label, id, opts)
  end

  def secondary_tab(conn, label, id, opts \\ []) do
    generic_tab(conn.assigns[:secondary_tab], label, id, opts)
  end

  defp generic_tab(active_id, label, id, opts) do
    action = opts[:to]
    icon = opts[:icon]
    HelperView.render("tab.html",
      id: id,
      active_id: active_id,
      label: label,
      action: action,
      icon: icon
    )
  end

  def non_ideal_state(title, description \\ "", opts \\ []) do
    icon = opts[:icon] || nil
    HelperView.render "non_ideal_state.html",
      title: title,
      description: description,
      icon: icon
  end
end
