defmodule SourceAcademyAdmin.ViewHelpers do
  @moduledoc false
  alias SourceAcademyAdmin.HelperView

  def navbar(conn, current_user) do
    SourceAcademyWeb.LayoutView.render "navbar.html",
      conn: conn,
      current_user: current_user
  end

  def admin_header(conn, title, controls \\ (fn -> "" end)) do
    HelperView.render "admin_header.html", conn: conn, title: title, controls: controls
  end

  def input_group(form, label, field, opts \\ []) do
    hint = opts[:hint]
    type = opts[:type] || :text
    rows = opts[:rows] || 5
    options = opts[:options] || []

    HelperView.render "input_group.html",
      form: form, field: field, label: label, hint: hint,
      type: type, rows: rows, options: options
  end

  def date_range_picker(form, label, start_field, end_field) do
    HelperView.render "date_range_picker.html",
      form: form, start_field: start_field, end_field: end_field,
      label: label
  end

  def simple_tabs(active_tab, tabs, content) do
    HelperView.render "simple_tabs.html",
      active_tab: active_tab,
      tabs: tabs,
      content: content
  end

  def non_ideal_state(title, description \\ "", opts \\ []) do
    SourceAcademyWeb.ViewHelpers.non_ideal_state(title, description, opts)
  end
end
