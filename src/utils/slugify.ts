const slugify = (string: string, separator = '-') => {
	return string
		.toLowerCase()
		.trim()
		.replace(/[\s_]+/g, separator) // Replace spaces and underscores with a dash
		.replace(/[^\w\-]+/g, '') // Remove all non-word characters except dashes
		.replace(/\-\-+/g, separator); // Replace multiple dashes with a single dash
};

export default slugify;
