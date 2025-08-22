pub fn sanitize_file_name(file_name: &str) -> String {
    let mut result = String::new();

    for ch in file_name.chars() {
        match ch {
            '<' | '>' | ':' | '"' | '/' | '\\' | '|' | '?' | '*' => result.push('_'),
            _ => result.push(ch),
        }
    }

    result = result.replace("..", "_");

    result = result.trim_start_matches('.').to_string();

    result = result.trim_end_matches('.').to_string();

    let words: Vec<&str> = result.split_whitespace().collect();
    result = words.join("_");

    let mut final_result = String::new();
    let mut prev_was_underscore = false;

    for ch in result.chars() {
        if ch == '_' {
            if !prev_was_underscore {
                final_result.push(ch);
                prev_was_underscore = true;
            }
        } else {
            final_result.push(ch);
            prev_was_underscore = false;
        }
    }

    final_result.chars().take(255).collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sanitize_file_name() {
        assert_eq!(sanitize_file_name("file<name>"), "file_name_");

        assert_eq!(sanitize_file_name("file..name"), "file_name");

        assert_eq!(sanitize_file_name("..filename."), "_filename");

        assert_eq!(sanitize_file_name("file   name"), "file_name");

        assert_eq!(sanitize_file_name("file___name"), "file_name");

        assert_eq!(
            sanitize_file_name("..my<file>:  name|with*bad?chars.."),
            "_my_file_name_with_bad_chars_"
        );
    }
}
