/**
 * Hyperloop Metabase Generator
 * Copyright (c) 2015 by Appcelerator, Inc.
 */
#include <iostream>
#include "class.h"
#include "method.h"
#include "property.h"
#include "parser.h"
#include "util.h"

namespace hyperloop {

	static bool isCategory = false;
	static bool isProtocol = false;
	static ClassDefinition *currentClass = nullptr;
	static std::map<std::string, std::vector<ClassDefinition *>> pendingClasses;

	static CXChildVisitResult parseClassMember (CXCursor cursor, CXCursor parent, CXClientData clientData) {
		auto classDef = static_cast<ClassDefinition*>(clientData);
		auto displayName = CXStringToString(clang_getCursorDisplayName(cursor));
		auto kind = clang_getCursorKind(cursor);
		// std::cout << "class display: " << displayName << " -> " << classDef->getName() << ", iscategory:" << classDef->isClassCategory() << std::endl;
		switch (kind) {
			case CXCursor_ObjCClassMethodDecl:
			case CXCursor_ObjCInstanceMethodDecl: {
				auto method = new MethodDefinition(cursor, displayName, classDef->getContext(), kind == CXCursor_ObjCInstanceMethodDecl, clang_Cursor_isObjCOptional(cursor));
				classDef->addMethod(method);
				method->parse(cursor, parent, classDef);
				break;
			}
			case CXCursor_ObjCIvarDecl: {
				break;
			}
			case CXCursor_ObjCPropertyDecl: {
				auto attributes = clang_Cursor_getObjCPropertyAttributes(cursor, 0);
				std::vector<std::string> attrs;
				if ((attributes & CXObjCPropertyAttr_readonly) == CXObjCPropertyAttr_readonly) {
					attrs.push_back("readonly");
				}
				if ((attributes & CXObjCPropertyAttr_readwrite) == CXObjCPropertyAttr_readwrite) {
					attrs.push_back("readwrite");
				}
				auto returnType = clang_getCursorType(cursor);
				auto returnTypeValue = CXStringToString(clang_getTypeSpelling(returnType));
				auto prop = new Property(displayName, new Type(classDef->getContext(), returnType, returnTypeValue), attrs, clang_Cursor_isObjCOptional(cursor));
				classDef->addProperty(prop);
				break;
			}
			case CXCursor_ObjCClassRef: {
				// set the name back to the class referenced. this is when this happens
				// @interface Foo (Bar)
				// whereby initially displayName on the class will be Bar and then
				// the class reference will be Foo.  in this case, we want to use Foo
				if (isCategory) {
					classDef->addCategory(classDef->getName());
					classDef->setName(displayName);
				}
				break;
			}
			case CXCursor_UnexposedAttr: {
				break;
			}
			case CXCursor_ObjCSuperClassRef: {
//				std::cout << "super class: " << displayName << " <- " << currentClass->getName () << std::endl;
				currentClass->setSuperclass(displayName);
				break;
			}
			case CXCursor_ObjCProtocolRef: {
//				std::cout << "protocol class: " << displayName << " <- " << currentClass->getName () << std::endl;
				currentClass->addProtocol(displayName);
				break;
			}
			case CXCursor_TemplateTypeParameter: {
				break;
			}
			case CXCursor_TypeRef: {
				break;
			}
			default: {
				std::cerr << "Not handling currently " << classDef->getName() << ":" << displayName << ", type: " << kind << std::endl;
				break;
			}
		}
		return CXChildVisit_Continue;
	}

	ClassDefinition::ClassDefinition (CXCursor cursor, const std::string &name, ParserContext *ctx) :
		Definition(cursor, name, ctx), category(false) {
	}

	ClassDefinition::~ClassDefinition () {
		for (auto it = this->methods.begin(); it != this->methods.end(); it++) {
			auto methodDef = it->second;
			delete methodDef;
		}
		for (auto it = this->properties.begin(); it != this->properties.end(); it++) {
			auto prop = it->second;
			delete prop;
		}
	}

	bool ClassDefinition::merge () const {
		if (pendingClasses.find(this->getName()) != pendingClasses.end()) {
			std::vector<ClassDefinition *> vector = pendingClasses[this->getName()];
			for (std::vector<ClassDefinition *>::iterator it = vector.begin(); it != vector.end(); it++) {
				ClassDefinition *def = *it;
				ClassDefinition::copy(def, (ClassDefinition *)this);
			}
			pendingClasses.erase(pendingClasses.find(this->getName()));
			return true;
		} else {
			return false;
		}
	}

	Json::Value ClassDefinition::toJSON () const {
		Json::Value kv;
		toJSONBase(kv);
		if (!this->methods.empty()) {
			Json::Value mkv;
			for (auto it = this->methods.begin(); it != this->methods.end(); it++) {
				auto name = (*it).first;
				auto md = (*it).second;
				mkv[name] = md->toJSON();
			}
			if (!mkv.empty()) {
				kv["methods"] = mkv;
			}
		}
		if (!this->properties.empty()) {
			Json::Value pkv;
			for (auto it = this->properties.begin(); it != this->properties.end(); it++) {
				auto name = (*it).first;
				auto pd = (*it).second;
				pkv[name] = pd->toJSON();
			}
			if (!pkv.empty()) {
				kv["properties"] = pkv;
			}
		}
		if (!protocols.empty()) {
			kv["protocols"] = hyperloop::toJSON(protocols);
		}
		if (!categories.empty()) {
			kv["categories"] = hyperloop::toJSON(categories);
		}
		if (!superClass.empty()) {
			kv["superclass"] = superClass;
		}
		return kv;
	}

	void ClassDefinition::addMethod (MethodDefinition *method) {
		methods[method->getName()] = method;
	}

	void ClassDefinition::addProperty (Property *property) {
		properties[property->getName()] = property;
	}

	void ClassDefinition::addProtocol (const std::string &name) {
		protocols.push_back(name);
	}

	void ClassDefinition::addCategory (const std::string &category) {
		categories.push_back(category);
	}
	void ClassDefinition::setSuperclass (const std::string &name) {
		superClass = name;
	}

	void ClassDefinition::copy (ClassDefinition *from, ClassDefinition *to) {
		for (auto it = from->methods.begin(); it != from->methods.end(); it++) {
			to->addMethod(it->second);
		}
		for (auto it = from->properties.begin(); it != from->properties.end(); it++) {
			to->addProperty(it->second);
		}
		for (auto protocol : from->protocols) {
			to->addProtocol(protocol);
		}
		for (auto category : from->categories) {
			to->addCategory(category);
		}
		if (!from->superClass.empty() && to->superClass.empty()) {
			to->setSuperclass(from->superClass);
		}
	}

	void ClassDefinition::complete (ParserContext *ctx) {
		// in case we got to the end of parsing and we still have pending classes
		// we need to merge them into the parser tree
		auto tree = ctx->getParserTree();
		std::vector<ClassDefinition *> mergers;
		std::vector<ClassDefinition *> pending;
		for (auto it = pendingClasses.begin(); it != pendingClasses.end(); it++) {
			auto name = it->first;
			if (tree->hasClass(name)) {
				auto found = tree->getClass(name);
				mergers.push_back(found);
			} else {
				auto vector = it->second;
				for (auto iit = vector.begin(); iit != vector.end(); iit++) {
					auto def = *iit;
					// if we have more than one class of the same name (categories)
					// then we should find the root class (one without superclass)
					// otherwise, we just add it
					if (vector.size() > 1) {
						if (!def->isClassCategory()) {
							tree->addClass(def);
							mergers.push_back(def);
							break;
						} else {
							pending.push_back(def);
						}
					} else {
						tree->addClass(def);
					}
				}
			}
		}
		// now that we're done, we need to merge them all
		for (auto it = mergers.begin(); it != mergers.end(); it++) {
			auto found = *it;
			found->merge();
		}
		for (auto it = pending.begin(); it != pending.end(); it++) {
			auto found = *it;
			if (!tree->hasClass(found->getName())) {
				tree->addClass(found);
			}
		}
		pendingClasses.clear();
	}

	//TODO: add deprecation message for class / method

	CXChildVisitResult ClassDefinition::executeParse (CXCursor cursor, ParserContext *context) {
		auto tree = context->getParserTree();
		currentClass = this;
		isCategory = clang_getCursorKind(cursor) == CXCursor_ObjCCategoryDecl;
		isProtocol = clang_getCursorKind(cursor) == CXCursor_ObjCProtocolDecl;
		auto name = this->getName();
		this->setIsCategory(isCategory);
		// std::cout << "---before visit: " << this->getName() << ", category: " << isCategory << ", protocol: " << isProtocol << std::endl;
		clang_visitChildren(cursor, parseClassMember, this);
		if (isProtocol) {
			tree->addProtocol(this);
		} else {
			if (!this->superClass.empty()) {
				if (!tree->hasClass(this->getName())) {
					tree->addClass(this);
				} else {
					// we need to migrate into our existing class
					auto classDef = tree->getClass(this->getName());
					ClassDefinition::copy(this, classDef);
				}
				merge();
			} else {
				auto key = this->getName();
				std::vector<ClassDefinition *> pending = pendingClasses[key];
				pending.push_back(this);
				pendingClasses[key] = pending;
			}
		}
		currentClass = nullptr;
		// std::cout << "---after visit: " << this->getName() << ", category: " << isCategory << std::endl;
		return CXChildVisit_Continue;
	}

}
