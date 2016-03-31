/**
 * Hyperloop Metabase Generator
 * Copyright (c) 2015 by Appcelerator, Inc.
 */
#ifndef HYPERLOOP_UTIL_H
#define HYPERLOOP_UTIL_H

#include <string>
#include <sstream>
#include <vector>
#include <map>

#include "clang-c/Index.h"
#include "json/json.h"

namespace hyperloop {
	class ParserTree;
	class ParserContext;
	class Type;
	class StructDefinition;
	class Definition;

	/**
	 * stringify an unsigned value
	 */
	std::string toString(unsigned value);

	/**
	 * stringify a long long value
	 */
	std::string toString(long long value);

	/**
	 * camel case a string
	 */
	std::string camelCase(const std::string &str);

	/**
	 * clean a string of any extranous, non-useful information
	 */
	std::string cleanString (const std::string &str);

	/**
	 * trim from start
	 */
	std::string &ltrim(std::string &s);

	/**
	 * trim from end
	 */
	std::string &rtrim(std::string &s);

	/**
	 * trim from both ends
	 */
	std::string &trim(std::string &s);

	/**
	 * returns true if string starts with character
	 */
	bool startsWith(const std::string &s, char ch);

	/**
	 * tokenize a string by delimeter
	 */
	std::vector<std::string>& tokenizeInto(const std::string &str, const char * delimeter, std::vector<std::string> &result);

	/**
	 * tokenize a string by delimeter
	 */
	std::vector<std::string> tokenize(const std::string &s, const char *delim);

	/**
	 * replace string with another string
	 */
	std::string replace(std::string str, std::string from, std::string to);

	/**
	 * when we have an unknown type, attempt to resolve the encoding
	 */
	std::string CXTypeUnknownToEncoding (ParserContext *context, Type *type);

	/**
	 * Given a CXType struct, return a string representation
	 */
	std::string CXTypeToType (const CXType &type);

	/**
	 * return a type for a objective-c encoding
	 */
	std::string EncodingToType (const std::string &encoding);

	/**
	 * returns true if the encoding needs to be resolved with CXTypeUnknownToEncoding
	 */
	bool encodingNeedsResolving (const std::string &encoding);

	/**
	 * resolve encoding into type
	 */
	void resolveEncoding (ParserTree *tree, Json::Value &kv, const std::string &typeKey = "type", const std::string &valueKey = "value");

	/**
	 * return a filtered version of the encoding, stripping out certains values
	 */
	std::string filterEncoding (const std::string &encoding);

	/**
	 * Given a CXString return a std::string handling memory as part of it
	 */
	std::string CXStringToString (const CXString &str);

	/**
	 * convert a StructDefinition into a string encoding
	 */
	std::string structDefinitionToEncoding (StructDefinition *def);

	/**
	 * return map as JSON string
	 */
	Json::Value toJSON(const std::map<std::string, std::string>& map);

	/**
	 * returns array as JSON string
	 */
	Json::Value toJSON(const std::vector<std::string>& array);

	/**
	 * return source location into map for a given cursor
	 */
	void getSourceLocation (CXCursor cursor, const ParserContext *ctx, std::map<std::string, std::string> &map);

	/**
	 * add a block if found as a type
	 */
	void addBlockIfFound (ParserContext *context, const Definition *definition, const std::string &framework, Type *type, const std::string &encoding);

	/**
	 * parse a block signature and return the returns value and place any args in the
	 * vector passed
	 */
	std::string parseBlock (const std::string &block, std::vector<std::string> &args);

	/**
	 * parse a block signature to JSON
	 */
	Json::Value callbackToJSON (ParserContext *context, const std::string &block);
};

#endif
