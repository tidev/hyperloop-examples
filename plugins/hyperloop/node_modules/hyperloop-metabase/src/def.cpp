/**
 * Hyperloop Metabase Generator
 * Copyright (c) 2015 by Appcelerator, Inc.
 */

#include "def.h"
#include "parser.h"
#include "util.h"
#include <iostream>

namespace hyperloop {

	Argument::Argument(const std::string &_name, Type *_type, const std::string &_encoding) : name(_name), type(_type), encoding(_encoding) {
//		std::cerr << "method argument: " << name << " " << encoding << std::endl;
	}

	Argument::~Argument() {
		delete type;
	}

	Json::Value Argument::toJSON() const {
		Json::Value kv;
		kv["name"] = this->name;
		kv["type"] = type->getType();
		kv["value"] = cleanString(type->getValue());
		kv["encoding"] = this->encoding;
		return kv;
	}

	Arguments::Arguments () {
	}

	Arguments::~Arguments() {
		for (auto it = arguments.begin(); it != arguments.end(); it++) {
			auto arg = *it;
			delete arg;
		}
	}

	void Arguments::add(const std::string &name, Type *type, const std::string &encoding) {
		arguments.push_back(new Argument(name, type, encoding));
	}

	const Argument& Arguments::get(size_t index) {
		return *arguments[index];
	}

	Json::Value Arguments::toJSON() const {
		Json::Value args;
		if (arguments.size() > 0) {
			for (auto it = arguments.begin(); it != arguments.end(); it++) {
				auto arg = *it;
				args.append(arg->toJSON());
			}
		} else {

			// force an empty array
			args.resize(1);
			args.clear();
		}
		return args;
	}

	Serializable::Serializable() {
	}

	Serializable::~Serializable() {
	}

	Type::Type (const Type &type) : context(type.context) {
		setType(type.type);
		setValue(type.value);
	}

	Type::Type (Type &&type) : context(type.context), type(std::move(type.type)), value(std::move(type.value)) {
	}

	Type::Type (ParserContext *ctx, const CXType &_type, const std::string &_value) : context(ctx) {
		setType(hyperloop::CXTypeToType(_type));
		setValue(_value);
	}

	Type::Type (ParserContext *ctx, const std::string &_type, const std::string &_value) : context(ctx) {
		setType(_type);
		setValue(_value);
	}

	Type::~Type () {
		context = nullptr;
	}

	void Type::swap(Type &other) {
		using std::swap;
		swap(value, other.value);
		swap(type, other.type);
		swap(context, other.context);
	}

	void Type::setType (const std::string &_type) {
		type = cleanString(_type);
	}

	void Type::setValue (const std::string &_value) {
		value = cleanString(_value);
	}

	Json::Value Type::toJSON() const {
		Json::Value kv;
		kv["type"] = type;
		kv["value"] = value;
		return kv;
	}

	Definition::Definition(CXCursor _cursor, const std::string &_name, ParserContext *ctx) :
		cursor(_cursor), name(_name), filename(ctx->getCurrentFilename()), line(ctx->getCurrentLine()), context(ctx) {
	}

	std::string Definition::getFramework () const {
		size_t pos = filename.find(".framework");
		if (pos != std::string::npos) {
			return filename.substr(0, pos);
		}
		if (filename.find("/usr/include") == std::string::npos &&
			filename.find("/usr/lib") == std::string::npos) {
			size_t pos = filename.find_last_of("/");
			if (pos != std::string::npos) {
				size_t ppos = filename.find_last_of("/", pos - 1);
				if (ppos == std::string::npos) {
					return filename.substr(0, ppos);
				}
				return filename.substr(ppos + 1, pos - ppos - 1);
			}
		}
		return filename;
	}

	void Definition::toJSONBase (Json::Value &kv) const {
		kv["name"] = name;
		std::string framework = getFramework();
		if (framework != filename) {
			if (framework.find("/") != std::string::npos) {
				auto lpos = framework.find_last_of("/");
				framework = framework.substr(lpos + 1);
			}
			kv["framework"] = framework;
			auto pos = filename.find("/Headers/");
			std::string fn = filename;
			if (pos != std::string::npos) {
				fn = filename.substr(pos + 9);
			}
			// if it looks like a CocoaPods header, trim that off too
			pos = fn.find("Public/");
			if (pos == 0) {
				kv["filename"] = fn.substr(pos + 7);
			} else {
				kv["filename"] = fn;
			}
			kv["thirdparty"] = filename.find(".framework") == std::string::npos;
		} else {
			kv["filename"] = filename;
		}
		kv["line"] = line;
	}

	CXChildVisitResult Definition::parse(CXCursor cursor, CXCursor parent, CXClientData clientData) {
		return this->executeParse(cursor, static_cast<ParserContext *>(clientData));
	}

}
